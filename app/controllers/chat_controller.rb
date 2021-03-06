
class ChatController < ApplicationController
  before_action :authenticate_user!

  def index
    @email = current_user.email
  end

  def start_public_chat

  end

  def start_private_chat

  end

  # get /single-channel
  def room
    redirect_to(action: 'enter_name') if cookies.encrypted[:user_name].blank?
  end

  def enter_name
    redirect_to(action: 'room') if cookies.encrypted[:user_name].present?
  end

  def enter_in_room
    redirect_to(action: 'room') if cookies.encrypted[:user_name].present?

    redirect_to(action: 'enter_name') if params[:name].blank?

    cookies.encrypted[:user_name] = params[:name]

    redirect_to(action: 'room')
  end

end
