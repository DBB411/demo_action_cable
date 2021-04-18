class ChatChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    stream_from "chat_room-#{params[:start_chat_room]}"
  end

  # recive data when client send data
  def receive(data)
    puts("data.class.name = #{data.class.name}")
    puts("data['room'] = #{data['room']}")

    ActionCable.server.broadcast("chat_room-#{data['room_name']}", data)
  end
end
