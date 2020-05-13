import execa from 'execa';

const cmd = async (c, args) => {
  const proc = execa(c, args);
  proc.stdout.pipe(process.stdout);
  await proc;
};

export default cmd;
