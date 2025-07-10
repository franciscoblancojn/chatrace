export interface IChatRace {
    PROPS: {
        URL: string;
        TOKEN: string;
        CUSTOM_FIELDS: {
            id: string;
            name: string;
            type: string;
        }[];
    };
    setCustomFieldProps: {
        key: string;
        value: string;
        user_id: string;
    };
    onCreateUserProps: {
        phone: string;
        first_name: string;
        last_name: string;
        email?: string;
        gender?: string;
    };
    onExecuteFlowProps: {
        user_id: string;
        flow_id: string;
    };
    getUsersByCustomFieldProps: {
        key: string;
        value: string;
    };
    onCreateUserIfNotExistProps: IChatRace["onCreateUserProps"] & {
        id: string;
    };
}
export declare class ChatRace {
    URL: IChatRace["PROPS"]["URL"];
    TOKEN: IChatRace["PROPS"]["TOKEN"];
    CUSTOM_FIELDS: IChatRace["PROPS"]["CUSTOM_FIELDS"];
    constructor({ TOKEN, URL, CUSTOM_FIELDS }: IChatRace["PROPS"]);
    onRequest({ body, method, url, }: {
        url: string;
    } & RequestInit): Promise<any>;
    getIdCustomFieldApi(): Promise<any>;
    getIdCustomField(key: string): Promise<string | undefined>;
    setCustomField({ key, value, user_id, }: IChatRace["setCustomFieldProps"]): Promise<any>;
    onCreateUser({ phone, first_name, last_name, email, gender, }: IChatRace["onCreateUserProps"]): Promise<any>;
    onExecuteFlow({ user_id, flow_id }: IChatRace["onExecuteFlowProps"]): Promise<any>;
    getUsersByCustomField({ key, value, }: IChatRace["getUsersByCustomFieldProps"]): Promise<any>;
    getUsersById(id: string): Promise<any>;
    onCreateUserIfNotExist({ id, first_name, last_name, phone, email, gender, }: IChatRace["onCreateUserIfNotExistProps"]): Promise<{
        isNew: boolean;
        resultCreate: any;
        user?: undefined;
        create?: undefined;
        message?: undefined;
        error?: undefined;
    } | {
        isNew: boolean;
        user: any;
        resultCreate?: undefined;
        create?: undefined;
        message?: undefined;
        error?: undefined;
    } | {
        create: boolean;
        message: any;
        error: any;
        isNew?: undefined;
        resultCreate?: undefined;
        user?: undefined;
    }>;
}
