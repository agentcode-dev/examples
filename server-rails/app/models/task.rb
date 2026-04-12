# frozen_string_literal: true

class Task < AgentCode::AgentCodeModel
  include Discard::Model

  agentcode_filters :title, :status, :priority
  agentcode_sorts :title, :status, :priority, :due_date
  agentcode_default_sort "created_at"
  agentcode_fields :id, :title, :description, :status, :priority, :estimated_hours, :due_date, :project_id, :assignee_id, :created_at, :updated_at
  agentcode_includes :project, :assignee

  validates :title, length: { maximum: 255 }, allow_nil: true
  validates :status, inclusion: { in: %w[todo in_progress in_review done] }, allow_nil: true
  validates :priority, inclusion: { in: %w[low medium high critical] }, allow_nil: true

  belongs_to :project
  belongs_to :assignee, class_name: "User", optional: true
  has_many :comments, dependent: :destroy
  has_and_belongs_to_many :labels, join_table: :task_labels
end
