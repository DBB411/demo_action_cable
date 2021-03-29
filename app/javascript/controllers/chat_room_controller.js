import consumer from "../channels/consumer"
import { Controller } from "stimulus"

var active_room_id = ''

export default class extends Controller {
  static targets = [
    "list"
  ]

  static values = { email: String };
  connect() {
    console.log("chat-controller#connect");
  }

  startChatRoom(event){
    var room_name = '';
    var room_title = event.target.dataset.roomTitle
    if (event.target.dataset.roomName == 'public'){
      room_name = 'public'
    } else {
      room_name = event.target.dataset.roomName;
    }
    this.subscribeChatChannel(room_name);
    this.addChatRoom(room_name, room_title);
  }

  subscribeChatChannel(room_name){
    this.channel = consumer.subscriptions.create({ channel: "ChatChannel", start_chat_room: room_name, sent_by: this.data.get("email") },  {
      connected(data) {
        // Called when the subscription is ready for use on the server
      },

      received(data) {
        this.appendLine(data);
      },

      appendLine(data) {
        const html = this.createLine(data);
        const element = document.getElementById("room_" + data["room_name"] + "_messages");
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
  }

  addChatRoom(room_name, room_title){
    const rooms = document.getElementById('rooms');
    const room_html = `
      <div id="room_${room_name}" class="relative w-full disabled-room">
      <div class="absolute top-0 flex items-center w-full p-3 bg-gray-100 shadow-md h-16">
        <div class="text-gray-700 text-xl font-semibold mx-4">${room_title}</div>
      </div>
        <div id="room_${room_name}_messages" class="flex flex-col w-full h-screen overflow-y-auto py-16 bg-gray-50">
        </div>
        <div class="absolute bottom-0 flex w-full p-3 bg-gray-100 shadow-md h-16">
          <input id="room_${room_name}_message_box" class="flex-grow border border-gray-200 p-2 mr-4" placeholder="Message">
          <div class="flex items-center text-white bg-green-400 hover:bg-orange-700 px-4 cursor-pointer" data-action="click->chat-room#sendMessage" data-room-name="${room_name}">Send</div>
        </div>
      </div>
    `
    rooms.insertAdjacentHTML("beforeend", room_html);

    if(active_room_id !== ''){
      document.getElementById(active_room_id).style.display = 'none';
    }
    active_room_id = "room_" + room_name ;
    document.getElementById(active_room_id).style.display = 'block';

    document.getElementById("start_chat_room_" + room_name).style.display = 'none';
    document.getElementById("show_chat_room_" + room_name).style.display = 'block';
  }

  showChatRoom(event){
    const roomName = event.target.dataset.roomName
    if(active_room_id !== null){
      document.getElementById(active_room_id).style.display = 'none';
    }
    active_room_id = "room_" + roomName
    document.getElementById(active_room_id).style.display = 'block';

  }

  sendMessage(event){
    var room_name = event.target.dataset.roomName
    this.channel.send({ sent_by: this.data.get("email"), room_name: room_name, message: document.getElementById("room_" + room_name + "_message_box").value});
  }
}
