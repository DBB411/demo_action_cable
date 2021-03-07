import consumer from "../channels/consumer"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [
    "messages",
    "messageBox",
    "sendMessageBtn",
    "subscribeBtn"
  ]

  static values = { sentBy: String }

  connect() {
    console.log("chat-controller#connect");
  }
  subscribeChatChannel(){
    this.channel = consumer.subscriptions.create({ channel: "ChatChannel" },  {
      received(data) {
        this.appendLine(data);
      },

      appendLine(data) {
        const html = this.createLine(data);
        const element = document.getElementById("messageViewer");
        element.insertAdjacentHTML("beforeend", html);
      },

      createLine(data) {
        return `
          <div>
            <div class="inline-block border-b bg-gray-200 mt-4 rounded-md text-grey-800 mx-4 p-3">
              <div class="mb-1 text-sm font-semibold text-gray-500">${data["sent_by"]}</div>
              <div >${data["message"]}</div>
            </div>
          </div>
        `
      }
    })
    console.log("Subscribed");
    this.subscribeBtnTarget.classList.add("hidden")
    this.messageBoxTarget.classList.remove("hidden");
    this.sendMessageBtnTarget.classList.remove("hidden");
  }

  sendMessage(){
    this.channel.send({ sent_by: this.data.get("sentBy"), message: this.messageBoxTarget.value});
  }
}
