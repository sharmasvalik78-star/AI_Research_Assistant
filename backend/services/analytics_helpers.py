from datetime import datetime, timedelta

from sqlalchemy import func

from models.chat_session import ChatSession
from models.message import Message


def generate_heatmap(db, user, days=84):
    """
    Generate activity heatmap for the last N days.
    """

    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)

    rows = (
        db.query(
            func.date(Message.created_at).label("date"),
            func.count(Message.id).label("count"),
        )
        .join(ChatSession, Message.session_id == ChatSession.id)
        .filter(ChatSession.user_id == user.id)
        .filter(Message.created_at >= start_date)
        .group_by(func.date(Message.created_at))
        .order_by(func.date(Message.created_at))
        .all()
    )

    lookup = {
        str(row.date): int(row.count)
        for row in rows
    }

    heatmap = []

    current = start_date

    while current <= end_date:
        key = current.isoformat()

        heatmap.append(
            {
                "date": key,
                "count": lookup.get(key, 0),
            }
        )

        current += timedelta(days=1)

    return heatmap


def calculate_current_streak(heatmap):
    """
    Current consecutive active days ending today.
    """

    streak = 0

    for day in reversed(heatmap):
        if day["count"] > 0:
            streak += 1
        else:
            break

    return streak


def calculate_longest_streak(heatmap):
    """
    Longest consecutive active-day streak.
    """

    longest = 0
    current = 0

    for day in heatmap:

        if day["count"] > 0:
            current += 1
            longest = max(longest, current)
        else:
            current = 0

    return longest

def calculate_most_active_day(heatmap):
    """
    Returns the day with the highest activity.
    """

    if not heatmap:
        return {
            "date": None,
            "count": 0,
        }

    best = max(heatmap, key=lambda day: day["count"])

    return {
        "date": best["date"],
        "count": best["count"],
    }


def calculate_activity_summary(heatmap):
    """
    Returns summary statistics for the supplied heatmap.
    """

    total_questions = sum(day["count"] for day in heatmap)

    active_days = sum(
        1
        for day in heatmap
        if day["count"] > 0
    )

    inactive_days = len(heatmap) - active_days

    return {
        "period_days": len(heatmap),
        "total_questions": total_questions,
        "active_days": active_days,
        "inactive_days": inactive_days,
    }


def generate_activity_analytics(db, user, days=84):
    """
    Generates all activity analytics used by the dashboard.
    """

    heatmap = generate_heatmap(
        db=db,
        user=user,
        days=days,
    )

    return {
        "heatmap": heatmap,
        "current_streak": calculate_current_streak(
            heatmap
        ),
        "longest_streak": calculate_longest_streak(
            heatmap
        ),
        "most_active_day": calculate_most_active_day(
            heatmap
        ),
        "activity_summary": calculate_activity_summary(
            heatmap
        ),
    }