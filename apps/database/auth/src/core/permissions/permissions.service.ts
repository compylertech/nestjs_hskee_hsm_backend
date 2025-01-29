import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  private permissions: Map<string, string[]> = new Map();

  constructor() {
    this.permissions.set('admin', ['read', 'write', 'delete']);
    this.permissions.set('user', ['read']);
  }

  getPermissions(role: string): string[] {
    return this.permissions.get(role) || [];
  }

  addPermission(role: string, permission: string): void {
    if (!this.permissions.has(role)) {
      this.permissions.set(role, []);
    }
    this.permissions.get(role)?.push(permission);
  }

  removePermission(role: string, permission: string): void {
    const rolePermissions = this.permissions.get(role);
    if (rolePermissions) {
      this.permissions.set(
        role,
        rolePermissions.filter((p) => p !== permission),
      );
    }
  }
}
