
// Define the structure for a keyboard key
interface KeyboardKey {
  key: string;
  display?: string;
}

// Define the structure for keyboard layouts
type KeyboardLayoutType = {
  [layout: string]: KeyboardKey[][];
};

export const KeyboardLayouts: KeyboardLayoutType = {
  qwerty: [
    [
      { key: "`", display: "~" },
      { key: "1", display: "1" },
      { key: "2", display: "2" },
      { key: "3", display: "3" },
      { key: "4", display: "4" },
      { key: "5", display: "5" },
      { key: "6", display: "6" },
      { key: "7", display: "7" },
      { key: "8", display: "8" },
      { key: "9", display: "9" },
      { key: "0", display: "0" },
      { key: "-", display: "-" },
      { key: "=", display: "=" },
      { key: "Backspace", display: "⌫" }
    ],
    [
      { key: "Tab", display: "Tab" },
      { key: "q", display: "q" },
      { key: "w", display: "w" },
      { key: "e", display: "e" },
      { key: "r", display: "r" },
      { key: "t", display: "t" },
      { key: "y", display: "y" },
      { key: "u", display: "u" },
      { key: "i", display: "i" },
      { key: "o", display: "o" },
      { key: "p", display: "p" },
      { key: "[", display: "[" },
      { key: "]", display: "]" },
      { key: "\\", display: "\\" }
    ],
    [
      { key: "CapsLock", display: "Caps" },
      { key: "a", display: "a" },
      { key: "s", display: "s" },
      { key: "d", display: "d" },
      { key: "f", display: "f" },
      { key: "g", display: "g" },
      { key: "h", display: "h" },
      { key: "j", display: "j" },
      { key: "k", display: "k" },
      { key: "l", display: "l" },
      { key: ";", display: ";" },
      { key: "'", display: "'" },
      { key: "Enter", display: "↵" }
    ],
    [
      { key: "Shift", display: "⇧" },
      { key: "z", display: "z" },
      { key: "x", display: "x" },
      { key: "c", display: "c" },
      { key: "v", display: "v" },
      { key: "b", display: "b" },
      { key: "n", display: "n" },
      { key: "m", display: "m" },
      { key: ",", display: "," },
      { key: ".", display: "." },
      { key: "/", display: "/" },
      { key: "Shift", display: "⇧" }
    ],
    [
      { key: " ", display: "Space" }
    ]
  ],
  
  azerty: [
    [
      { key: "²", display: "²" },
      { key: "&", display: "1" },
      { key: "é", display: "2" },
      { key: "\"", display: "3" },
      { key: "'", display: "4" },
      { key: "(", display: "5" },
      { key: "-", display: "6" },
      { key: "è", display: "7" },
      { key: "_", display: "8" },
      { key: "ç", display: "9" },
      { key: "à", display: "0" },
      { key: ")", display: "°" },
      { key: "=", display: "+" },
      { key: "Backspace", display: "⌫" }
    ],
    [
      { key: "Tab", display: "Tab" },
      { key: "a", display: "a" },
      { key: "z", display: "z" },
      { key: "e", display: "e" },
      { key: "r", display: "r" },
      { key: "t", display: "t" },
      { key: "y", display: "y" },
      { key: "u", display: "u" },
      { key: "i", display: "i" },
      { key: "o", display: "o" },
      { key: "p", display: "p" },
      { key: "^", display: "^" },
      { key: "$", display: "$" },
      { key: "*", display: "*" }
    ],
    [
      { key: "CapsLock", display: "Caps" },
      { key: "q", display: "q" },
      { key: "s", display: "s" },
      { key: "d", display: "d" },
      { key: "f", display: "f" },
      { key: "g", display: "g" },
      { key: "h", display: "h" },
      { key: "j", display: "j" },
      { key: "k", display: "k" },
      { key: "l", display: "l" },
      { key: "m", display: "m" },
      { key: "ù", display: "ù" },
      { key: "Enter", display: "↵" }
    ],
    [
      { key: "Shift", display: "⇧" },
      { key: "w", display: "w" },
      { key: "x", display: "x" },
      { key: "c", display: "c" },
      { key: "v", display: "v" },
      { key: "b", display: "b" },
      { key: "n", display: "n" },
      { key: ",", display: "," },
      { key: ";", display: ";" },
      { key: ":", display: ":" },
      { key: "!", display: "!" },
      { key: "Shift", display: "⇧" }
    ],
    [
      { key: " ", display: "Space" }
    ]
  ],
  
  dvorak: [
    [
      { key: "`", display: "~" },
      { key: "1", display: "1" },
      { key: "2", display: "2" },
      { key: "3", display: "3" },
      { key: "4", display: "4" },
      { key: "5", display: "5" },
      { key: "6", display: "6" },
      { key: "7", display: "7" },
      { key: "8", display: "8" },
      { key: "9", display: "9" },
      { key: "0", display: "0" },
      { key: "[", display: "[" },
      { key: "]", display: "]" },
      { key: "Backspace", display: "⌫" }
    ],
    [
      { key: "Tab", display: "Tab" },
      { key: "'", display: "'" },
      { key: ",", display: "," },
      { key: ".", display: "." },
      { key: "p", display: "p" },
      { key: "y", display: "y" },
      { key: "f", display: "f" },
      { key: "g", display: "g" },
      { key: "c", display: "c" },
      { key: "r", display: "r" },
      { key: "l", display: "l" },
      { key: "/", display: "/" },
      { key: "=", display: "=" },
      { key: "\\", display: "\\" }
    ],
    [
      { key: "CapsLock", display: "Caps" },
      { key: "a", display: "a" },
      { key: "o", display: "o" },
      { key: "e", display: "e" },
      { key: "u", display: "u" },
      { key: "i", display: "i" },
      { key: "d", display: "d" },
      { key: "h", display: "h" },
      { key: "t", display: "t" },
      { key: "n", display: "n" },
      { key: "s", display: "s" },
      { key: "-", display: "-" },
      { key: "Enter", display: "↵" }
    ],
    [
      { key: "Shift", display: "⇧" },
      { key: ";", display: ";" },
      { key: "q", display: "q" },
      { key: "j", display: "j" },
      { key: "k", display: "k" },
      { key: "x", display: "x" },
      { key: "b", display: "b" },
      { key: "m", display: "m" },
      { key: "w", display: "w" },
      { key: "v", display: "v" },
      { key: "z", display: "z" },
      { key: "Shift", display: "⇧" }
    ],
    [
      { key: " ", display: "Space" }
    ]
  ],
  
  colemak: [
    [
      { key: "`", display: "~" },
      { key: "1", display: "1" },
      { key: "2", display: "2" },
      { key: "3", display: "3" },
      { key: "4", display: "4" },
      { key: "5", display: "5" },
      { key: "6", display: "6" },
      { key: "7", display: "7" },
      { key: "8", display: "8" },
      { key: "9", display: "9" },
      { key: "0", display: "0" },
      { key: "-", display: "-" },
      { key: "=", display: "=" },
      { key: "Backspace", display: "⌫" }
    ],
    [
      { key: "Tab", display: "Tab" },
      { key: "q", display: "q" },
      { key: "w", display: "w" },
      { key: "f", display: "f" },
      { key: "p", display: "p" },
      { key: "g", display: "g" },
      { key: "j", display: "j" },
      { key: "l", display: "l" },
      { key: "u", display: "u" },
      { key: "y", display: "y" },
      { key: ";", display: ";" },
      { key: "[", display: "[" },
      { key: "]", display: "]" },
      { key: "\\", display: "\\" }
    ],
    [
      { key: "CapsLock", display: "Caps" },
      { key: "a", display: "a" },
      { key: "r", display: "r" },
      { key: "s", display: "s" },
      { key: "t", display: "t" },
      { key: "d", display: "d" },
      { key: "h", display: "h" },
      { key: "n", display: "n" },
      { key: "e", display: "e" },
      { key: "i", display: "i" },
      { key: "o", display: "o" },
      { key: "'", display: "'" },
      { key: "Enter", display: "↵" }
    ],
    [
      { key: "Shift", display: "⇧" },
      { key: "z", display: "z" },
      { key: "x", display: "x" },
      { key: "c", display: "c" },
      { key: "v", display: "v" },
      { key: "b", display: "b" },
      { key: "k", display: "k" },
      { key: "m", display: "m" },
      { key: ",", display: "," },
      { key: ".", display: "." },
      { key: "/", display: "/" },
      { key: "Shift", display: "⇧" }
    ],
    [
      { key: " ", display: "Space" }
    ]
  ]
};
