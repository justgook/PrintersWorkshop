//TODO rewrite it to something cleaner
const callNext = function (index, message) {
  var ref;
  return (ref = this.pipes[index]) != null ? ref.call(this, callNext.bind(this, index + 1), message) : void 0;
};

export default class Connection {
  constructor(url) {

    this.send = this.send.bind(this);
    this.message = this.message.bind(this);

    if (url) this.url = url;
    this.pipes = [];
    this.ws = null;
    this.messagesBuffer = [];
    this._reconnectHandeler = null;
  }


  connect(url = this.url) {
    console.log("Connection::connect (#{url})");
    this.url = url;
    if (this.ws != null) this.ws.close();
    this.ws = new WebSocket(url);
    this.ws.addEventListener('open', ()=> {
      //this.ws.send message for message in this.messagesBuffer
      this.messagesBuffer.forEach((msg)=> this.ws.send(msg));
      this.messagesBuffer = [];
      console.log(`Connection::open ${url}`);
      this.ws.addEventListener('message', this.message);
    });
    this.ws.addEventListener('error', (e)=> {
      this.message({data: "{}", target: {readyState: this.ws.readyState}});
      console.log(`Connection::error (${url})`);
    });

    this.ws.addEventListener('close', ()=> {
      this.message({data: "{}", target: {readyState: this.ws.readyState}});
      console.log(`Connection::close (${url})`);
    });
  }

  reconnect(url = this.url) {
    this.url = url;
    // this.connecting = true;
    clearTimeout(this._reconnectHandeler);
    this._reconnectHandeler = setTimeout((()=> this.connect(url)), 1000);

  }

  send(msg) {
    if (this.ws.readyState === WebSocket.OPEN)
      this.ws.send(msg);
    else
      this.messagesBuffer.push(msg);
  }

  pipe(callback) {
    this.pipes.push(callback);
    return {pipe: this.pipe.bind(this)};
  }

  message(msg) {
    callNext.call(this, 0, msg);
  }
}
