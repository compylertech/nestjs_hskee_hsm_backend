import { Type } from '@nestjs/common';
import { RouteTree } from '@nestjs/core';
import { Controller } from '@nestjs/common/interfaces';

export function appendSubPathsToBaseModule(basePath: string, controllers: Type<Controller>[]): RouteTree[] {
    return controllers.map((controller) => {
        return {
            path: `${basePath}`,
            module: controller as Type<Controller>,
        };
    });
}