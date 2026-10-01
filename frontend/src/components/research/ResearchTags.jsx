import "./ResearchTags.css";

const TAG_COLORS = [
  "tag-blue",
  "tag-green",
  "tag-purple",
  "tag-orange",
  "tag-pink",
  "tag-cyan",
];

function getTagColor(tag) {
  let hash = 0;

  for (let i = 0; i < tag.length; i++) {
    hash += tag.charCodeAt(i);
  }

  return TAG_COLORS[hash % TAG_COLORS.length];
}

export default function ResearchTags({
  tags = [],
}) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="research-tags">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`research-tag ${getTagColor(tag)}`}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}