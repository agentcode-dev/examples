# frozen_string_literal: true

class Comment < AgentCode::AgentCodeModel
  include AgentCode::HasUuid
  include Discard::Model

  agentcode_default_sort "created_at"
  agentcode_fields :id, :body, :task_id, :user_id, :uuid, :created_at, :updated_at
  agentcode_includes :task, :user

  validates :body, presence: true, allow_nil: true

  belongs_to :task
  belongs_to :user

  before_create :auto_set_user_id

  private

  def auto_set_user_id
    return if user_id.present?
    return unless defined?(RequestStore)

    current_user = RequestStore.store[:agentcode_current_user]
    self.user_id = current_user.id if current_user
  end
end
