import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'
import Role from '#models/role'
import User from '#models/user'
import UserRole from '#models/user_role'
import Project from '#models/project'
import Task from '#models/task'
import Comment from '#models/comment'
import Label from '#models/label'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // ---------------------------------------------------------------
    // 1. Roles
    // ---------------------------------------------------------------
    const roleData = [
      { name: 'Owner', slug: 'owner', description: 'Full access to everything' },
      { name: 'Admin', slug: 'admin', description: 'Operational admin' },
      { name: 'Manager', slug: 'manager', description: 'Can manage projects and tasks' },
      { name: 'Member', slug: 'member', description: 'Can work on assigned tasks' },
      { name: 'Viewer', slug: 'viewer', description: 'Read-only access' },
    ]

    const roles: Record<string, InstanceType<typeof Role>> = {}
    for (const r of roleData) {
      roles[r.slug] = await Role.updateOrCreate({ slug: r.slug }, r)
    }

    // ---------------------------------------------------------------
    // 2. Organizations
    // ---------------------------------------------------------------
    const acme = await Organization.updateOrCreate(
      { slug: 'acme-corp' },
      { name: 'Acme Corp', description: 'A leading provider of everything.', isActive: true }
    )

    const globex = await Organization.updateOrCreate(
      { slug: 'globex-inc' },
      { name: 'Globex Inc', description: 'Global excellence in innovation.', isActive: true }
    )

    // ---------------------------------------------------------------
    // 3. Users (password hashed automatically by AuthFinder mixin)
    // ---------------------------------------------------------------
    const alice = await User.updateOrCreate(
      { email: 'alice@acme.com' },
      { fullName: 'Alice Johnson', password: 'password' }
    )

    const bob = await User.updateOrCreate(
      { email: 'bob@acme.com' },
      { fullName: 'Bob Smith', password: 'password' }
    )

    const carol = await User.updateOrCreate(
      { email: 'carol@acme.com' },
      { fullName: 'Carol Williams', password: 'password' }
    )

    const dave = await User.updateOrCreate(
      { email: 'dave@acme.com' },
      { fullName: 'Dave Brown', password: 'password' }
    )

    const eve = await User.updateOrCreate(
      { email: 'eve@globex.com' },
      { fullName: 'Eve Davis', password: 'password' }
    )

    // ---------------------------------------------------------------
    // 4. User-Role Assignments
    // ---------------------------------------------------------------
    await UserRole.updateOrCreate(
      { userId: alice.id, roleId: roles['admin'].id, organizationId: acme.id },
      { permissions: ['*'] }
    )

    await UserRole.updateOrCreate(
      { userId: bob.id, roleId: roles['manager'].id, organizationId: acme.id },
      {
        permissions: [
          'projects.index', 'projects.show', 'projects.store', 'projects.update',
          'tasks.index', 'tasks.show', 'tasks.store', 'tasks.update',
          'comments.index', 'comments.show', 'comments.store', 'comments.update', 'comments.destroy',
          'labels.index', 'labels.show', 'labels.store', 'labels.update',
        ],
      }
    )

    await UserRole.updateOrCreate(
      { userId: carol.id, roleId: roles['member'].id, organizationId: acme.id },
      {
        permissions: [
          'projects.index', 'projects.show',
          'tasks.index', 'tasks.show', 'tasks.update',
          'comments.index', 'comments.show', 'comments.store', 'comments.update',
          'labels.index', 'labels.show',
        ],
      }
    )

    await UserRole.updateOrCreate(
      { userId: dave.id, roleId: roles['viewer'].id, organizationId: acme.id },
      {
        permissions: [
          'projects.index', 'projects.show',
          'tasks.index', 'tasks.show',
          'comments.index', 'comments.show',
          'labels.index', 'labels.show',
        ],
      }
    )

    await UserRole.updateOrCreate(
      { userId: eve.id, roleId: roles['admin'].id, organizationId: globex.id },
      { permissions: ['*'] }
    )

    // ---------------------------------------------------------------
    // 5. Projects
    // ---------------------------------------------------------------
    const websiteRedesign = await Project.updateOrCreate(
      { title: 'Website Redesign', organizationId: acme.id },
      {
        description: 'Complete overhaul of the company website with modern design.',
        status: 'active',
        budget: 50000.00,
        internalNotes: 'Priority project for Q2. CEO is personally involved.',
        startsAt: '2026-01-15',
        endsAt: '2026-06-30',
      }
    )

    const mobileApp = await Project.updateOrCreate(
      { title: 'Mobile App MVP', organizationId: acme.id },
      {
        description: 'Build the first version of our mobile application.',
        status: 'draft',
        budget: 120000.00,
        internalNotes: 'Awaiting final approval from the board.',
        startsAt: '2026-04-01',
        endsAt: '2026-12-31',
      }
    )

    const apiIntegration = await Project.updateOrCreate(
      { title: 'API Integration', organizationId: acme.id },
      {
        description: 'Integrate with third-party payment and shipping APIs.',
        status: 'active',
        budget: 30000.00,
        internalNotes: null,
        startsAt: '2026-02-01',
        endsAt: '2026-05-15',
      }
    )

    // ---------------------------------------------------------------
    // 6. Tasks
    // ---------------------------------------------------------------
    const task1 = await Task.updateOrCreate(
      { title: 'Design homepage mockup', projectId: websiteRedesign.id },
      {
        description: 'Create high-fidelity mockup for the new homepage.',
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 16.00,
        dueDate: '2026-02-28',
        assigneeId: carol.id,
      }
    )

    const task2 = await Task.updateOrCreate(
      { title: 'Set up CI/CD pipeline', projectId: websiteRedesign.id },
      {
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 8.00,
        dueDate: '2026-03-15',
        assigneeId: bob.id,
      }
    )

    const task3 = await Task.updateOrCreate(
      { title: 'Research payment gateways', projectId: apiIntegration.id },
      {
        description: 'Evaluate Stripe, PayPal, and local payment options.',
        status: 'done',
        priority: 'high',
        estimatedHours: 4.00,
        dueDate: '2026-02-15',
        assigneeId: alice.id,
      }
    )

    await Task.updateOrCreate(
      { title: 'Write user stories', projectId: mobileApp.id },
      {
        description: 'Document all user stories for the mobile app MVP scope.',
        status: 'todo',
        priority: 'low',
        estimatedHours: 12.00,
        dueDate: '2026-04-30',
        assigneeId: bob.id,
      }
    )

    // ---------------------------------------------------------------
    // 7. Labels
    // ---------------------------------------------------------------
    await Label.updateOrCreate(
      { name: 'bug', organizationId: acme.id },
      { color: '#e11d48' }
    )

    await Label.updateOrCreate(
      { name: 'feature', organizationId: acme.id },
      { color: '#2563eb' }
    )

    await Label.updateOrCreate(
      { name: 'urgent', organizationId: acme.id },
      { color: '#f59e0b' }
    )

    await Label.updateOrCreate(
      { name: 'documentation', organizationId: acme.id },
      { color: '#10b981' }
    )

    // ---------------------------------------------------------------
    // 8. Comments
    // ---------------------------------------------------------------
    await Comment.updateOrCreate(
      { taskId: task1.id, userId: alice.id, body: 'Looking great so far! Let me know when the first draft is ready.' },
      {}
    )

    await Comment.updateOrCreate(
      { taskId: task1.id, userId: carol.id, body: 'I will have the mockup ready by Friday.' },
      {}
    )

    await Comment.updateOrCreate(
      { taskId: task3.id, userId: alice.id, body: 'Stripe seems like the best option for our use case.' },
      {}
    )
  }
}
