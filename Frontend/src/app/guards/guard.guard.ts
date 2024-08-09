import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../support-chat/services/chat.service';

export const myGuard: CanActivateFn = (route, state) => {
  const chatService = inject(ChatService);
  const router = inject(Router);

  const userName = chatService.getUserName();
  if (userName) {
    return true;
  } else {
    router.navigate(['/welcome']);
    return false;
  }
};
