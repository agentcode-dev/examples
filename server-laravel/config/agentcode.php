<?php

return [
    'models' => [
        'organizations' => \App\Models\Organization::class,
        'roles' => \App\Models\Role::class,
    ],
    'route_groups' => [
        'tenant' => [
            'prefix' => '{organization}',
            'middleware' => [\AgentCode\Http\Middleware\ResolveOrganizationFromRoute::class],
            'models' => '*',
        ],
    ],
    'multi_tenant' => [
        'organization_identifier_column' => 'id',
    ],
    'invitations' => [
        'expires_days' => env('INVITATION_EXPIRES_DAYS', 7),
        'allowed_roles' => null,
    ],
    'nested' => [
        'path' => 'nested',
        'max_operations' => 50,
        'allowed_models' => null,
    ],
    'client_path' => env('AGENTCODE_CLIENT_PATH'),
    'mobile_path' => env('AGENTCODE_MOBILE_PATH'),
    'test_framework' => 'pest',
    'postman' => [
        'role_class' => 'App\Models\Role',
        'user_role_class' => 'App\Models\UserRole',
        'user_class' => 'App\Models\User',
    ],
];
