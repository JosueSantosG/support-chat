import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AbstractControl,
    FormControl,
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
    isLoading: boolean = false;
    myForm: FormGroup;
    name: FormControl;

    constructor(
        private clienteService: ClienteService,
        private router: Router
    ) {
        this.name = new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^[a-zA-Z ]*$'),
            this.noWhitespaceValidator(),
        ]);
        this.myForm = new FormGroup({
            name: this.name,
        });
    }

    ngOnInit(): void {}

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
        this.myForm.reset();

        this.clienteService.createUser(nameUser).subscribe((response) => {
            sessionStorage.setItem(
                'id_usuario',
                response.result.id_usuario.toString()
            );
            this.router.navigate(['/welcome/chat']);
            //this.loadMsj();
            this.isLoading = false;
        });
    }

    /* private loadMsj() {
        const idchat = sessionStorage.getItem('id_chat');
        if (idchat === null) {
            return;
        }
        this.clienteService.joinRoom(idchat);
    } */

}
