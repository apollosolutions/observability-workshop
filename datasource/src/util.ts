export interface RequestParams { }

export interface ResponseBody { }

export interface RequestBody { }

export interface UserRequestQuery {
    id: string | Array<string> | undefined;
}
export interface PostRequestQuery {
    id: string | Array<string> | undefined;
    authorId: string | Array<string> | undefined;
}
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}