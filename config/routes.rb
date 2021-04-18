Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get "chat/enter_name", to: "chat#enter_name", as: :chat_enter_name
  get "chat/enter_in_room", to: "chat#enter_in_room", as: :chat_enter_in_room
  get "chats", to: "chat#index"
end
