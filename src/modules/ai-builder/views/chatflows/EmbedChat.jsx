import PropTypes from "prop-types";
import { useState } from "react";

// Const
import { baseURL } from "@/modules/ai-builder/store/constant";
// Project import
import { CheckboxInput } from "@/modules/ai-builder/ui-component/checkbox/Checkbox";
import { SafeCopyBlock } from "@/modules/ai-builder/ui-component/code/SafeCopyBlock";

const embedPopupHtmlCode = (chatflowid) => {
  return `<script type="module">
    import Chatbot from "https://flowisechatembed-0ozc.onrender.com/web.js?v=1"
    Chatbot.init({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
    })
</script>`;
};



export const defaultThemeConfig = {
  button: {
    backgroundColor: "#3B81F6",
    right: 20,
    bottom: 20,
    size: 48,
    dragAndDrop: true,
    iconColor: "white",
    customIconSrc:
      "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
    autoWindowOpen: {
      autoOpen: true,
      openDelay: 2,
      autoOpenOnMobile: false,
    },
  },
  tooltip: {
    showTooltip: true,
    tooltipMessage: "Hi There 👋!",
    tooltipBackgroundColor: "black",
    tooltipTextColor: "white",
    tooltipFontSize: 16,
  },
  disclaimer: {
    title: "Disclaimer",
    message:
      'By using this chatbot, you agree to the <a target="_blank" href="https://flowiseai.com/terms">Terms & Condition</a>',
    textColor: "black",
    buttonColor: "#3b82f6",
    buttonText: "Start Chatting",
    buttonTextColor: "white",
    blurredBackgroundColor: "rgba(0, 0, 0, 0.4)",
    backgroundColor: "white",
  },
  customCSS: ``,
  chatWindow: {
    showTitle: true,
    showAgentMessages: true,
    title: "Agent Kit Bot",
    titleAvatarSrc:
      "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
    welcomeMessage: "Hello! This is custom welcome message",
    errorMessage: "This is a custom error message",
    backgroundColor: "#ffffff",
    backgroundImage: "enter image path or link",
    height: 700,
    width: 400,
    fontSize: 16,
    starterPrompts: ["What is a bot?", "Who are you?"],
    starterPromptFontSize: 15,
    clearChatOnReload: false,
    sourceDocsTitle: "Sources:",
    renderHTML: true,
    botMessage: {
      backgroundColor: "#f7f8ff",
      textColor: "#303235",
      showAvatar: true,
      avatarSrc:
        "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
    },
    userMessage: {
      backgroundColor: "#3B81F6",
      textColor: "#ffffff",
      showAvatar: true,
      avatarSrc:
        "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
    },
    textInput: {
      placeholder: "Type your question",
      backgroundColor: "#ffffff",
      textColor: "#303235",
      sendButtonColor: "#3B81F6",
      maxChars: 50,
      maxCharsWarningMessage:
        "You exceeded the characters limit. Please input less than 50 characters.",
      autoFocus: true,
      sendMessageSound: true,
      sendSoundLocation: "send_message.mp3",
      receiveMessageSound: true,
      receiveSoundLocation: "receive_message.mp3",
    },
    feedback: {
      color: "#303235",
    },
    dateTimeToggle: {
      date: true,
      time: true,
    },
    footer: {
      textColor: "#303235",
      text: "Powered by",
      company: "Agent Kit",
      companyLink: "http://agents.devxhub.com",
    },
  },
};

const customStringify = (obj) => {
  const stringified = JSON.stringify(obj, null, 4)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/: "([^"]+)"/g, (match, value) =>
      value.includes("<") ? `: "${value}"` : `: '${value}'`
    )
    .replace(/: "(true|false|\d+)"/g, ": $1")
    .replace(/customCSS: ""/g, "customCSS: ``");
  return stringified
    .split("\n")
    .map((line, index) => {
      if (index === 0) return line;
      return " ".repeat(8) + line;
    })
    .join("\n");
};

const embedPopupHtmlCodeCustomization = (chatflowid) => {
  return `<script type="module">
    import Chatbot from https://flowisechatembed-0ozc.onrender.com/web.js?v=1"
    Chatbot.init({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
        chatflowConfig: {
            /* Chatflow Config */
        },
        observersConfig: {
            /* Observers Config */
        },
        theme: ${customStringify(defaultThemeConfig)}
    })
</script>`;
};



const EmbedChat = ({ chatflowid }) => {
  const [embedChatCheckboxVal, setEmbedChatCheckbox] = useState(false);

  const onCheckBoxEmbedChatChanged = (newVal) => {
    setEmbedChatCheckbox(newVal);
  };

  return (
    <>
      <span>
        Paste this anywhere in the <code>{`<body>`}</code> tag of your html file.
        <p>
          You can also specify a&nbsp;
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.npmjs.com/package/flowise-embed?activeTab=versions"
          >
            version
          </a>
          :&nbsp;
          <code>{`https://flowisechatembed-0ozc.onrender.com/web.js?v=1`}</code>
        </p>
      </span>
      <div style={{ height: 10 }} />

      <SafeCopyBlock
        text={embedPopupHtmlCode(chatflowid)}
        language="javascript"
        showLineNumbers={false}
        wrapLines
      />

      <CheckboxInput
        label="Show Embed Chat Config"
        value={embedChatCheckboxVal}
        onChange={onCheckBoxEmbedChatChanged}
      />

      {embedChatCheckboxVal && (
        <SafeCopyBlock
          text={embedPopupHtmlCodeCustomization(chatflowid)}
          language="javascript"
          showLineNumbers={false}
          wrapLines
        />
      )}
    </>
  );
};

EmbedChat.propTypes = {
  chatflowid: PropTypes.string,
};

export default EmbedChat;
