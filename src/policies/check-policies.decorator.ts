import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './policies.interfaces';

export const CHECK_POLICIES_KEY = 'check-policies';
export const CheckPolicies = (...handlers: PolicyHandler[]) => 
    SetMetadata(CHECK_POLICIES_KEY, handlers);
