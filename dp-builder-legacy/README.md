# DP-Builder

DP-Builder is a graphical interface for creating and configuring multi-skill AI assistants, built on top of DeepPavlov

## How to run

Warning: DP-Builder is currently still under development. For now, you can try out the development version and please report any issues you encounter.

Right now, you need to build DP-Builder yourself to try it out. More convenient installation methods are coming soon!

DP-Builder has been only tested on Linux, but it should work fine on MacOS and in WSL too. If you experience any issues on those systems, let us know!
Also, there will definitely be a native Windows build of the first official release.

First, make sure you have the following requirements set up on your system:
 - tmux
 - Node 16+
 - Python 3.9+
 - [pnpm](https://pnpm.io)
 - [poetry](https://python-poetry.org/)
 - [Docker](https://docs.docker.com/engine/install/)
 
Optional, but recommended for training: 
 - Nvidia GPU
 - [Nvidia docker runtime](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)

Once you have those in place, clone the repository:

```
git clone https://github.com/deepmipt/dp-builder.git
cd dp-builder
```

Then install the dependencies:

```
pnpm install
```

And finally, start everything up:

```
./dev.sh
```

