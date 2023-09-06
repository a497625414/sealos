import { generateTerminalTemplate, TerminalStatus } from '@/interfaces/terminal';
import { authSession } from '@/service/auth';
import { ApplyYaml, CRDMeta, GetCRD, GetUserDefaultNameSpace, K8sApi } from '@/service/kubernetes';
import { jsonRes } from '@/service/response';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import request from '@/service/request';

export const terminal_meta: CRDMeta = {
  group: 'terminal.sealos.io',
  version: 'v1',
  namespace: 'terminal-app',
  plural: 'terminals'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const kubeconfig = await authSession(req.headers);
    const kc = K8sApi(kubeconfig);

    const kube_user = kc.getCurrentUser();

    if (!kube_user || !kube_user.token || !kube_user.name) {
      throw new Error('kube_user get failed');
    }
    //const namespace = GetUserDefaultNameSpace(kube_user.name);
    const namespace = "ns-virxz952";
    //const unionId = namespace.split("-")[1];
    const unionId = namespace.split("-")[1];
    const tenantCode = namespace.split("-")[1];
    const email = "test13@sealos.run"
    const password="Zxc123123"; 
    const client_id="console-site";
    const username=namespace.split("-")[1];;
    const grant_type="password";

    var response;
    console.log(namespace);
    
    try {
        // 你的目标 API URL
        // const getTenantUrl = 'https://api.automq.cloud.sealos.run/system/tenants'+'/'+tenantCode;
        const createTenantUrl = 'https://api.automq.cloud.sealos.run/system/tenants';
        const getTokenUrl = 'https://auth.automq.cloud.sealos.run/realms/default/protocol/openid-connect/token';
        // 从请求体中获取参数
        // const { unionId, email, tenantCode } = req.body;
    
        // 发送 POST 请求
        // const getResponse = await  axios({
        //   url:getTenantUrl,
        //   method:"get",
        //   headers:{
        //     "Content-Type": "application/x-www-form-urlencoded"

        //   },
        //   data:{
        //     tenantCode
        //   },
        // })
        // console.log(getResponse); // 打印接口返回的数据        
        
        const response = await  axios({
          url:createTenantUrl,
          method:"post",
          headers:{
            "Content-Type": "application/json"

          },
          data:{
            unionId,
            email,
            tenantCode,
            password
          },
        })
        //console.log(response); // 打印接口返回的数据
        

        // const result = await  axios({
        //   url:getTokenUrl,
        //   method:"post",
        //   headers:{
        //     "Content-Type" : "application/x-www-form-urlencoded"
        //   },
        //   data:{
        //     client_id,
        //     username,
        //     password,
        //     grant_type
        //   },
        // })

        const data={
          url:response.data?.loginUrl,
          //token:result.data?.access_token
        }
        console.log(data); // 打印接口返回的数据
        return jsonRes(res, { code: 200, data:data, message: '' });
      } catch (error) {
        console.log(error,'err');
        jsonRes(res, { code: 500, error });
      }
}catch (error) {
  jsonRes(res, { code: 500, error });
}
}
