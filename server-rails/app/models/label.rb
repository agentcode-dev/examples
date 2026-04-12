# frozen_string_literal: true

class Label < AgentCode::AgentCodeModel
  include AgentCode::BelongsToOrganization
  include Discard::Model

  agentcode_filters :name
  agentcode_sorts :name
  agentcode_default_sort "created_at"
  agentcode_fields :id, :name, :color, :created_at, :updated_at

  agentcode_except_actions :forceDelete

  validates :name, length: { maximum: 255 }, allow_nil: true

  has_and_belongs_to_many :tasks, join_table: :task_labels
end
