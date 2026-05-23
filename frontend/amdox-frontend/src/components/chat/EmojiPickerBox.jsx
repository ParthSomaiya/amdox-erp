import EmojiPicker from "emoji-picker-react";

export default function EmojiPickerBox({
  onEmojiClick,
}) {

  return (
    <div className="absolute bottom-14 right-0 z-50">
      <EmojiPicker
        onEmojiClick={(e) =>
          onEmojiClick(e.emoji)
        }
      />
    </div>
  );

}