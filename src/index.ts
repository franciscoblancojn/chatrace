export interface IChatRace {
    PROPS : {
        URL: string;
        TOKEN: string;
        CUSTOM_FIELDS: {
            id: string;
            name: string;
            type: string;
        }[];
    }

    setCustomFieldProps: { key: string; value: string; user_id: string };
    onCreateUserProps: {
        phone: string;
        first_name: string;
        last_name: string;
        email?: string;
        gender?: string;
    };
    onExecuteFlowProps: { user_id: string; flow_id: string };
    getUsersByCustomFieldProps: { key: string; value: string };
    onCreateUserIfNotExistProps: IChatRace["onCreateUserProps"] & {
        id: string;
    };
}

export class ChatRace {
    URL: IChatRace['PROPS']["URL"];
    TOKEN: IChatRace['PROPS']["TOKEN"];
    CUSTOM_FIELDS: IChatRace['PROPS']["CUSTOM_FIELDS"];

    constructor({ TOKEN, URL, CUSTOM_FIELDS }: IChatRace['PROPS']) {
        this.TOKEN = TOKEN;
        this.URL = URL;
        this.CUSTOM_FIELDS = CUSTOM_FIELDS;
    }
    async onRequest({
        body = undefined,
        method = "GET",
        url,
    }: {
        url: string;
    } & RequestInit) {
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
        } catch (error) {
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
    async getIdCustomField(key: string) {
        const id = this.CUSTOM_FIELDS.find((e) => e.name == key)?.id;
        return id;
    }
    async setCustomField({
        key,
        value,
        user_id,
    }: IChatRace["setCustomFieldProps"]) {
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
    async onCreateUser({
        phone,
        first_name,
        last_name,
        email,
        gender,
    }: IChatRace["onCreateUserProps"]) {
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
    async onExecuteFlow({ user_id, flow_id }: IChatRace["onExecuteFlowProps"]) {
        const result = await this.onRequest({
            url: `/users/${user_id}/send/${flow_id}`,
            method: "POST",
        });
        return result;
    }
    async getUsersByCustomField({
        key,
        value,
    }: IChatRace["getUsersByCustomFieldProps"]) {
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
    async getUsersById(id: string) {
        if (!id) {
            throw new Error("id invalid");
        }
        const result = await this.onRequest({
            url: `/users/${id}`,
            method: "GET",
        });

        return result;
    }

    async onCreateUserIfNotExist({
        id,
        first_name,
        last_name,
        phone,
        email,
        gender,
    }: IChatRace["onCreateUserIfNotExistProps"]) {
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
        } catch (error: any) {
            return {
                create: false,
                message: error?.message,
                error,
            };
        }
    }
}
