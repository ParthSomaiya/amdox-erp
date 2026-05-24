import Picker from "emoji-picker-react";

export default function EmojiPicker({

  onEmojiClick,

}) {

  return (

    <div className="absolute bottom-14 right-0 z-50 shadow-lg">

      <Picker
        onEmojiClick={onEmojiClick}
      />

    </div>

  );

}