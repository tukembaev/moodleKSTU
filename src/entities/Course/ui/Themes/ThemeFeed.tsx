import React, { useState } from "react";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { FeedItem } from "entities/Course/model/types/course";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Textarea } from "shared/shadcn/ui/textarea";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type FeedProps = {
  items: FeedItem[];
  isLoading?: boolean;
  depth?: number;
  theme_id?: string;
};

export const ThemeFeed: React.FC<FeedProps> = ({
  items,
  depth = 0,
  theme_id,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newText, setNewText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  const { mutate: add_comment } = courseQueries.add_comment();
  const { mutate: reply_comment } = courseQueries.reply_comment();
  const { mutate: like_comment } = courseQueries.like_comment();

  const navigate = useNavigate();
  const isRoot = depth === 0;

  const handleSubmit = () => {
    if (replyingTo && replyText.trim()) {
      reply_comment({ comment_id: replyingTo, text: replyText });
      setReplyText("");
      setReplyingTo(null);
    } else if (!replyingTo && newText.trim()) {
      add_comment({ theme: theme_id as string, text: newText });
      setNewText("");
    }
  };

  if (isRoot && items.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-muted-foreground text-sm mb-3">
          Комментариев пока нет — будь первым, кто оставит своё мнение!
        </p>
        <Textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Напиши свой комментарий..."
          className="text-sm"
        />
        <div className="mt-2 flex gap-2">
          <Button size="sm" onClick={handleSubmit}>
            Отправить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className={`ml-${depth > 0 ? 2 : 0} space-y-4 relative mt-2`}>
        {items.map((item) => (
          <li key={item.id} className="relative">
            <div className="flex gap-3">
              <Avatar
                className="w-8 h-8 cursor-pointer"
                onClick={() => navigate(`/profile/${item.user.user_id}`)}
              >
                <AvatarImage
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className="font-medium text-sm cursor-pointer hover:text-orange-300"
                    onClick={() => navigate(`/profile/${item.user.user_id}`)}
                  >
                    {item.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.created_at), "PPP p", {
                      locale: ru,
                    })}
                  </span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap">{item.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setReplyingTo(replyingTo === item.id ? null : item.id)
                    }
                    className="flex items-center gap-1 text-xs px-0"
                  >
                    <MessageCircle className="w-4 h-4" /> Ответить
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => like_comment({ comment_id: item.id })}
                    className="flex items-center gap-1 text-xs px-0"
                  >
                    <ThumbsUp className="w-4 h-4" /> Полезно ({item.likes || 0})
                  </Button>
                </div>
              </div>
            </div>

            {replyingTo === item.id && (
              <div className="mt-3 ml-11">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напиши свой ответ..."
                  className="text-sm"
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={handleSubmit}>
                    Отправить
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {item.replies && item.replies.length > 0 && (
              <div
                className="mt-4 ml-10 relative"
                style={{ borderLeft: "1px solid #e2e8f0" }}
              >
                <ThemeFeed
                  items={item.replies}
                  depth={depth + 1}
                  theme_id={theme_id}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {isRoot && (
        <div className="mt-6">
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Добавить комментарий..."
            className="text-sm"
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={handleSubmit}>
              Отправить
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
