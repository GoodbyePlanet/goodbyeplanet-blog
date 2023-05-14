---
title: "Understanding gRPC - With example project"
date: 2023-05-08
tags: [grpc, rpc]
authors:
    - Nemanja
---

So what is **gRPC**? It's an open-source remote procedure call framework created by Google.
Let's break it down a bit more to see what is **RPC**.

**RPC** (remote procedure call) is a protocol, it allows two or more computers to communicate
with each other over the network in a way that clients can call functions/procedures on the
remote server without having to understand network architecture or communication
details of that remote system.
In a nutshell, it works in a way that the client sends a message to a server requesting a function/procedure
to be executed. The server receives the message and executes the requested function/procedure, and then
sends a response message to the client.
It's efficient because it abstracts away the complexity of the network communication and with that
programs can interact with each other as if they are on the same machine.
There are several implementations of the **RPC**, one of them is **gRPC**.

At its core **gRPC** uses Protocol Buffers as its data serialization format.
You can read more about Protocol Buffers in my previous blog. [Protocol Buffers](https://weeblog-kappa.vercel.app/post/protobuf).

**gRPC** is very useful in scenarios where low-latency communication between backend services is required. It's 
very powerful for cross-platform communication because of **gRPC** support for different [programming languages](https://grpc.io/docs/languages/).

Ok, enough of the theory. I've created a small project to play around with **gRPC**.
I have three services. "*api-gateway*" which is implemented in Typescript. It's an express server that exposes `api/users` and `api/users/:id`
endpoints, it also acts as a **gRPC** client which communicates with "*user-service*" implemented in Python. This service acts as a both
**gRPC** server and client. It's a client for the third service "*order-service*" implemented in Java.

Here is the [Github Repo](https://github.com/GoodbyePlanet/grpc_example).
Clone it, fork it, and play around with it. I think the best way to learn is by implementing something in a chosen technology.

Have fun!
