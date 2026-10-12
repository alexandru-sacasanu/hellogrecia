import Link from "next/link";
import { Icon, type IconName } from "./Icon";

// P14 EmptyState
export function EmptyState({ icon = "compass", title, text, href, action }: { icon?: IconName; title: string; text?: string; href?: string; action?: string }) {
  return (
    <div className="empty" data-id="P14">
      <Icon name={icon} />
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {href && action && <Link className="btn btn-primary" href={href}>{action}</Link>}
    </div>
  );
}
