
export default {
  glaas: {
    url: 'https://glaas-stage.corp.adobe.com',
    clientId: '657acbf5-bf11-4698-827b-f17f4e7a388d',
    workflows: {
      Standard: {
        product: 'Marcomm',
        project: 'Adhoc',
        // workflowName: 'Human Translation',
        workflowName: 'Machine Translation',
      },
      HybridMT: {
        product: 'WCMS',
        project: 'WCMS_FASTLANE',
        // workflowName: 'Human Translation',
        workflowName: 'Machine Translation',
        
      }
    }
  },
  sp: {
    site: 'https://graph.microsoft.com/v1.0/me', // private repo for testing
    rootFolders: '/helix/fedpub',
    clientId: '52c587ca-af13-485f-ae9d-da3d2a6efe8f',
    authority: 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1',
  }
}