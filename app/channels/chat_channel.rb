class ChatChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    stream_from 'public_chat_room'
  end

  # recive data when client send data
  def receive(data)
    ActionCable.server.broadcast('public_chat_room', data)
  end
end
