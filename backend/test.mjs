import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.promises.resolveSrv('_mongodb._tcp.satyam001.ykch04n.mongodb.net')
  .then(result => console.log('SRV resolved:', result))
  .catch(err => console.log('SRV failed:', err));