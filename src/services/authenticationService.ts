import { fetchData, fetchWithAuth, Result, UserDto } from "./postService";

export interface RegistrationUserDto {
    username: string;
    email: string;
    password: string;
}


export interface LoginRequest {
    username: string;
    password: string;
}

export interface PasswordResetDto {
    token: string;
    newPassword: string;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    username: string;
}

export interface ModifyUserDto {
    username: string;
    email: string;
    tags: string[];
}

// sign up - dupa ce un user isi da register, va primi un email care contine un token care e folosit pt care user-ul sa fie enabled
// chestia asta se face prin endpointu de /enable
export async function register(user: RegistrationUserDto): Promise<void> {
    const response = await fetchData(`http://localhost:8080/buzzbyte/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const result: Result<null> = await response.json();
        if (result.flag) {
            console.log(result.message); // User created successfully
        } else {
            console.error('Signup failed:', result.message);
        }
}

// implementare: dupa form-ul de sign up ar putea sa apara un alt form doar cu un field in care user-ul introduce token-ul primit in email
export async function enableUser(token: string): Promise<void> {
    const response = await fetchData(`http://localhost:8080/buzzbyte/auth/enable/${token}`, {
        method: 'PUT',
    });

    const result: Result<null> = await response.json();
    if (result.flag) {
        console.log(result.message); // User enabled 
    } else {
        console.error('Enable user failed:', result.message);
    }
}

// la formul de login ar putea fi un link "forgot password?" care te va duce spre o alta pagina unde user-ul isi introduce email-ul
// consider ca (nu am incercat asta) pentru a pastra implementarea curenta care consta ca dupa sign up user-ul trece direct 
// la pagina de ales tag-uri, ar trebui apelat fix imediat dupa 'enableUser' functia asta de 'login'
// functia asta se va folosi si la form-ul normal de login
export async function login(loginRequest: LoginRequest): Promise<void> {
    console.log(loginRequest)
    const response = await fetchData(`http://localhost:8080/buzzbyte/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
    });

    const result: Result<string> = await response.json();
    if (result.flag) {
        console.log('Login successful:', result.message);
        // Store the token in localStorage
        localStorage.setItem('authToken', result.data);
    } else {
        console.error('Login failed:', result.message);
    }
}


// nu avem o functie de logout pe backend, pentru ca nici cand user-ul isi da login nu e stocat nicaieri bearer token, 
// deci aici doar il sterg din local storage
export function logout(): void {
    localStorage.removeItem('authToken');
    console.log('Logged out successfully');
}

// chestia asta s-ar apela de pe pagina de 'forgot password?' si aici user-ul ar trebui sa dea input la email-ul lui
// si dand submit o sa primeasca un email cu un token
export async function requestPasswordReset(email: string): Promise<void> {
    const response = await fetchData('http://localhost:8080/buzzbyte/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',   
        },
        body: email,
    });

    const result: Result<null> = await response.json();
    if (result.flag) {
        console.log(result.message); // Password sent to email
    } else {
        console.error('Reset password request failed:', result.message);
    }
}

// aici e un nou form cu token-ul primit pe email si parola noua pe care user-ul doreste sa o introduca
export async function resetPassword(dto: PasswordResetDto): Promise<void> {
    const response = await fetchData('http://localhost:8080/buzzbyte/auth/reset-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    const result: Result<null> = await response.json();
    if (result.flag) {
        console.log(result.message); // Password reset successfully
    } else {
        console.error('Password reset failed:', result.message);
    }
}

// prin request-ul asta user-ul primeste o parola noua generata random si un token, in rest functioneaza la fel ca functia de dinainte
// nu cred ca o sa ne folosim de asta
export async function getRandomPassword(token: string): Promise<String|void> {
    try {
        const response = await fetchData(`http://localhost:8080/buzzbyte/auth/reset-password-email/${token}`, {
            method: 'POST',
        });

        const result: Result<null> = await response.json();
        if (result.flag) {
            console.log(result.message); // Password sent to email
        } else {
            console.error('Failed to send password:', result.message);
        }
    } catch (error) {
        console.error('Error while sending password:', error);
    }
}

// get pentru user-ul logat curent
export async function getUser(): Promise<UserDto> {
    const response = await fetchWithAuth('http://localhost:8080/buzzbyte/users', {
        method: 'GET',
    });

    const result: Result<UserDto> = await response.json();
    if (result.flag) {
        return result.data;
    } else {
        throw new Error('Failed to fetch user details: ' + result.message);
    }
}

// dintr-o pagina numita spre exemplu 'user settings' user-ul isi poate modifica parola
// ma ocup eu de profile/user settings page
export async function changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const response = await fetchWithAuth('http://localhost:8080/buzzbyte/users/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordDto),
    });

    const result: Result<null> = await response.json();
    if (result.flag) {
        console.log(result.message);
    } else {
        throw new Error('Failed to change password: ' + result.message);
    }
}

// prin asta isi poate modifica anumite date gen username, email si tags
// ma ocup eu de profile/user settings page
export async function modifyUser(userId: number, modifyUserDto: ModifyUserDto): Promise<UserDto> {
    const response = await fetchWithAuth(`http://localhost:8080/buzzbyte/users/${userId}/modify`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifyUserDto),
    });

    console.log(modifyUserDto.username)

    const result: Result<UserDto> = await response.json();
    if (result.flag) {
        return result.data;
    } else {
        throw new Error('Failed to modify user: ' + result.message);
    }
}

// prin asta user-ul isi poate alege niste tag-uri pe care sa le urmareasca
// functia se poate apela din pagina de ales tag-uri
export async function addTagsToUser(userId: number, tags: string[]): Promise<UserDto> {
    const response = await fetchWithAuth(`http://localhost:8080/buzzbyte/users/${userId}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tags),
    });

    const result: Result<UserDto> = await response.json();
    if (result.flag) {
        return result.data;
    } else {
        throw new Error('Failed to add tags to user: ' + result.message);
    }
}