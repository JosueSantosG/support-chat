import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ClienteService } from './../../services/cliente.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
    isLoading:boolean = false;
    myForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.myForm = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                    Validators.pattern('^[a-zA-Z ]*$'),
                    this.noWhitespaceValidator(),
                ],
            ],
        });
    }

    get nameControl() {
        return this.myForm.get('name');
    }

    noWhitespaceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            // Verificar si el valor tiene 3 o más espacios consecutivos
            const hasThreeOrMoreSpaces = /\s{3,}/.test(value);
            return hasThreeOrMoreSpaces ? { whitespace: true } : null;
        };
    }

    joinRoom() {
      this.isLoading = true;

        if (this.myForm.invalid) {
            return;
        }

        const nameUser = this.myForm.value.name;
        sessionStorage.setItem('userName', nameUser);
        sessionStorage.setItem('typeUser', 'cliente');

        this.clienteService.createUser(nameUser).subscribe((response) => {
            sessionStorage.setItem(
                'id_chat',
                response.result.id_chat.toString()
            );
            this.router.navigate(['/welcome/chat']);
            this.loadMsj();
            this.isLoading = false;

        });
    }

    private loadMsj() {
        const idchat = sessionStorage.getItem('id_chat');
        if (idchat === null) {
            return;
        }
        this.clienteService.joinRoom(idchat);
    }
}
