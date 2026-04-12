<?php

namespace App\Models;

use AgentCode\Models\AgentCodeModel;
// use AgentCode\Traits\HasAuditTrail;
// use AgentCode\Traits\HasUuid;
// use AgentCode\Traits\BelongsToOrganization;
use App\Models\Project;
use App\Models\User;


class Task extends AgentCodeModel
{
    // use HasAuditTrail;
    // use HasUuid;
    // use BelongsToOrganization;

    protected $fillable = [
            'title',
            'description',
            'status',
            'priority',
            'estimated_hours',
            'due_date',
            'project_id',
            'assignee_id',
        ];

    // ---------------------------------------------------------------
    // Validation rules
    // ---------------------------------------------------------------

    // Format rules for all fields (applied on both store and update).
    protected $validationRules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:255',
            'priority' => 'required|string|max:255',
            'estimated_hours' => 'nullable|numeric',
            'due_date' => 'nullable|date',
            'project_id' => 'required|integer|exists:projects,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
        ];

    // ---------------------------------------------------------------
    // Query Builder configuration (used by AgentCode's GlobalController)
    // ---------------------------------------------------------------

    public static $allowedFilters = [
            'title',
            'status',
            'priority',
        ];
    public static $allowedSorts = [
            'title',
            'status',
            'priority',
            'due_date',
        ];
    public static $defaultSort = 'created_at';
    public static $allowedFields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'estimated_hours',
            'due_date',
            'project_id',
            'assignee_id',
            'created_at',
            'updated_at',
        ];
    public static $allowedIncludes = [
            'project',
            'assignee',
        ];
    // public static $allowedSearch = [];

    // ---------------------------------------------------------------
    // Pagination (uncomment to enable default pagination)
    // ---------------------------------------------------------------
    // public static bool $paginationEnabled = false;
    // protected $perPage = 25;

    // ---------------------------------------------------------------
    // Middleware (uncomment to add per-model middleware)
    // ---------------------------------------------------------------
    // public static array $middleware = [];
    // public static array $middlewareActions = [];

    // ---------------------------------------------------------------
    // Exclude actions (uncomment to disable specific CRUD endpoints)
    // ---------------------------------------------------------------
    // public static array $exceptActions = [];

    // ---------------------------------------------------------------
    // Hidden columns (add columns to hide from API responses)
    // ---------------------------------------------------------------
    // protected static $additionalHiddenColumns = [];

    // ---------------------------------------------------------------
    // Relationships
    // ---------------------------------------------------------------

    public function project(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Comment::class);
    }


}
