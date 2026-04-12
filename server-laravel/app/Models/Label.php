<?php

namespace App\Models;

use AgentCode\Models\AgentCodeModel;
// use AgentCode\Traits\HasAuditTrail;
// use AgentCode\Traits\HasUuid;
use AgentCode\Traits\BelongsToOrganization;


class Label extends AgentCodeModel
{
    // use HasAuditTrail;
    // use HasUuid;
    use BelongsToOrganization;

    protected $fillable = [
            'name',
            'color',
        ];

    // ---------------------------------------------------------------
    // Validation rules
    // ---------------------------------------------------------------

    // Format rules for all fields (applied on both store and update).
    protected $validationRules = [
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:255',
        ];

    // ---------------------------------------------------------------
    // Query Builder configuration (used by AgentCode's GlobalController)
    // ---------------------------------------------------------------

    public static $allowedFilters = [
            'name',
        ];
    public static $allowedSorts = [
            'name',
        ];
    public static $defaultSort = 'created_at';
    public static $allowedFields = [
            'id',
            'name',
            'color',
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

}
