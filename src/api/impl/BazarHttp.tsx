import axios from "axios";
import { HOST_CONCIG } from "../../bazar-config";
import { ApiResponse } from "./ApiResponse";

export async function getBazarData(url_path: string, request_data: any) {
    var config = {
        method: 'get',
        url: url_path,
        baseURL: HOST_CONCIG.apihost,
        params: request_data,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var ret = await axios(config as any)
    return ret.data as ApiResponse;
}

export async function postBazarData(url_path: string, request_data: any) {

    var config = {
        method: 'post',
        url: url_path,
        baseURL: HOST_CONCIG.apihost,
        data: request_data,
        headers: {
            'Content-Type': 'application/json'
        },
    }

    var ret = await axios(config as any)
    return ret.data as ApiResponse;
}
