<?php

namespace App\Models;

use AgentCode\Models\AgentCodeModel;
// use AgentCode\Traits\HasAuditTrail;
// use AgentCode\Traits\HasUuid;
// use AgentCode\Traits\BelongsToOrganization;
use App\Models\Task;
use App\Models\User;


class Comment extends AgentCodeModel
{
    // use HasAuditTrail;
    // use HasUuid;
    // use BelongsToOrganization;

    protected $fillable = [
            'body',
            'task_id',
            'user_id',
        ];

    // ---------------------------------------------------------------
    // Validation rules
    // ---------------------------------------------------------------

    // Format rules for all fields (applied on both store and update).
    protected $validationRules = [
            'body' => 'required|string',
            'task_id' => 'required|integer|exists:tasks,id',
            'user_id' => 'required|integer|exists:users,id',
        ];

    // ---------------------------------------------------------------
    // Query Builder configuration (used by AgentCode's GlobalController)
    // ---------------------------------------------------------------

    public static $allowedFilters = [];
    public static $allowedSorts = [];
    public static $defaultSort = 'created_at';
    public static $allowedFields = [
            'id',
            'body',
            'task_id',
            'user_id',
            'created_at',
            'updated_at',
        ];
    public static $allowedIncludes = [
            'task',
            'user',
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

    public function task(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }


}
