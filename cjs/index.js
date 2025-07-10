"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRace = void 0;
class ChatRace {
    URL;
    TOKEN;
    CUSTOM_FIELDS;
    constructor({ TOKEN, URL, CUSTOM_FIELDS }) {
        this.TOKEN = TOKEN;
        this.URL = URL;
        this.CUSTOM_FIELDS = CUSTOM_FIELDS;
    }
    async onRequest({ body = undefined, method = "GET", url, }) {
        try {
            const respond = await fetch(`${this.URL}${url}`, {
                headers: {
                    accept: "application/json",
                    "X-ACCESS-TOKEN": this.TOKEN,
                },
                body,
                method,
            });
            const result = await respond.json();
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getIdCustomFieldApi() {
        const result = await this.onRequest({
            url: "/accounts/custom_fields",
        });
        return result;
    }
    async getIdCustomField(key) {
        const id = this.CUSTOM_FIELDS.find((e) => e.name == key)?.id;
        return id;
    }
    async setCustomField({ key, value, user_id, }) {
        const id = await this.getIdCustomField(key);
        if (!id) {
            throw new Error("key invalid");
        }
        const result = await this.onRequest({
            url: `/users/${user_id}/custom_fields/${id}`,
            method: "POST",
            body: new URLSearchParams({
                value: value,
            }),
        });
        return result;
    }
    async onCreateUser({ phone, first_name, last_name, email, gender, }) {
        const result = await this.onRequest({
            url: `/users`,
            method: "POST",
            body: JSON.stringify({
                phone,
                first_name,
                last_name,
                email,
                gender,
            }),
        });
        return result;
    }
    async onExecuteFlow({ user_id, flow_id }) {
        const result = await this.onRequest({
            url: `/users/${user_id}/send/${flow_id}`,
            method: "POST",
        });
        return result;
    }
    async getUsersByCustomField({ key, value, }) {
        const field_id = await this.getIdCustomField(key);
        if (!field_id) {
            throw new Error("key custom field invalid");
        }
        const result = await this.onRequest({
            url: `/users/find_by_custom_field?field_id=${field_id}&value=${value}`,
            method: "GET",
        });
        result.field_id = field_id;
        return result;
    }
    async getUsersById(id) {
        if (!id) {
            throw new Error("id invalid");
        }
        const result = await this.onRequest({
            url: `/users/${id}`,
            method: "GET",
        });
        return result;
    }
    async onCreateUserIfNotExist({ id, first_name, last_name, phone, email, gender, }) {
        try {
            const user = await this.getUsersById(id);
            if (user == undefined) {
                const resultCreate = await this.onCreateUser({
                    first_name,
                    last_name,
                    phone,
                    email,
                    gender,
                });
                return {
                    isNew: true,
                    resultCreate,
                };
            }
            return {
                isNew: false,
                user,
            };
        }
        catch (error) {
            return {
                create: false,
                message: error?.message,
                error,
            };
        }
    }
}
exports.ChatRace = ChatRace;
//# sourceMappingURL=index.js.map