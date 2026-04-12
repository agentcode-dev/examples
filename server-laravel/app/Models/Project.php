<?php

namespace App\Models;

use AgentCode\Models\AgentCodeModel;
use AgentCode\Traits\HasAuditTrail;
use AgentCode\Traits\BelongsToOrganization;


class Project extends AgentCodeModel
{
    use HasAuditTrail;
    use BelongsToOrganization;

    protected $fillable = [
            'title',
            'description',
            'status',
            'budget',
            'internal_notes',
            'starts_at',
            'ends_at',
        ];

    // ---------------------------------------------------------------
    // Validation rules
    // ---------------------------------------------------------------

    // Format rules for all fields (applied on both store and update).
    protected $validationRules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:255',
            'budget' => 'nullable|numeric',
            'internal_notes' => 'nullable|string',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
        ];

    // ---------------------------------------------------------------
    // Query Builder configuration (used by AgentCode's GlobalController)
    // ---------------------------------------------------------------

    public static $allowedFilters = [
            'title',
            'status',
        ];
    public static $allowedSorts = [
            'title',
            'status',
            'starts_at',
            'ends_at',
        ];
    public static $defaultSort = 'created_at';
    public static $allowedFields = [
            'id',
            'title',
            'description',
            'status',
            'budget',
            'internal_notes',
            'starts_at',
            'ends_at',
            'created_at',
            'updated_at',
        ];
    public static $allowedIncludes = [];
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

    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Task::class);
    }


}
