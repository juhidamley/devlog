"use client";

type Props = {
  html: string;
  className?: string;
  style?: React.CSSProperties;
};

export function PostContent({ html, className, style }: Props) {
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
