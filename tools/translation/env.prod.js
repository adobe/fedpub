
export default {
  glaas: {
    url: 'https://glaas.corp.adobe.com',
    clientId: '657acbf5-bf11-4698-827b-f17f4e7a388d',
    workflows: {
      Standard: {
        product: 'Marcomm',
        project: 'Adhoc',
        workflowName: 'Human Translation',
      },
      HybridMT: {
        product: 'WCMS_FASTLANE',
        project: 'FASTLANE',
        workflowName: 'Human Translation',
      }
    }
  },
  sp: {
    site: 'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,2a0dc059-717f-4ba5-96fe-e785b8ce4b42,f9facb82-d2ee-419d-846b-ff5ad39d8ffd', //FedsPublishing
    rootFolders: '/fedPub',
    clientId: '52c587ca-af13-485f-ae9d-da3d2a6efe8f',
    authority: 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1',
  }
}