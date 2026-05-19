let io;

export const initSocket = (serverIo) => {
  io = serverIo;
};

export const getIO = () => io;