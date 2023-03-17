---
title: "Protocol Buffers"
date: 2023-03-17
tags: [data, serialization, protobuf]
authors:
    - Nemanja
---

We all know what is JSON, YAML, XML right? Protocol Buffers are similar, but smaller, faster, and one can say
they are even simpler. Let's try to understand what *smaller*, *faster*, *simpler* means.

*SMALLER* - To compare Byte sizes for JSON and for Protobuf message I used python scripts which you can find in this [GitHub Repo](https://github.com/GoodbyePlanet/compare-sizes).

So to calculate byte size of the Protocol Buffer message some rules have to be followed. First, message should be encoded using Protocol Buffer
encoding rules, and then we can count the number of bytes in the encoded message.

```
message Person {
    string name = 1;
    int32 age = 2;
    bool isStudent = 3;
}
```
Assuming that the instance of the above message looks like This

```
name: "John Doe"
age: 30
isStudent: false
```

calculated byte size is 15 Bytes.

```
{
  "name": "John Doe",
  "age": 30,
  "isStudent": false
}
```

For the JSON format Byte size is 51.

This makes sense because JSON is a text-based format that uses Unicode encoding system to represent characters, because of that it can become large. On the other hand
Protocol Buffers use binary encoding which allows them to be smaller.

*FASTER* - Protocol Buffers are faster than JSON, and there are few reasons:

- Protocol Buffers are based on binary format, therefore they are smaller and more compact in size, because of that amount of time it takes to transmit data over the network is smaller.
- Protocol Buffers enforce schema definition for defining structure of the message/data. Because of this message validation is possible and 
therefore more efficient parsing which can improve overall performance.
- Also Protocol Buffers relies on code generation for the languages that they support. This allows faster parsing than JSON because it uses pre-generated
code compare to JSON which requires parsing at runtime.

*SIMPLER* - We can argue about this one, someone who is not from IT world will probably say that JSON is more readable because it doesn't have
data types and because of that it's more human readable. But for people from IT world I would say that it's the same at least for me it is.

Now that we compared Protocol Buffers with JSON let's talk a bit more about them.

We can define them as a combination of the definition language used to create (.proto files) and the code that protoc compiler generates. They provide strongly
typed schema definition, and mechanism for serializing, deserializing data. They are developed by Google, and used in frameworks such as [gRPC](https://grpc.io/) and Google Cloud.
Because of their performance advantages they are mostly used as a way to exchange large amount of data between different services. If services/applications
are written in different languages they are good fit because they provide consistent way of exchanging data by providing code generation for [multiple languages](https://protobuf.dev/overview/#cross-lang). 

If you would like to learn more about Protocol Buffers than what's summarized here, go to their [DOCS](https://protobuf.dev/).
