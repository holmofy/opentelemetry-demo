# node builder
FROM node:18-alpine as NODE_BUILD
COPY frontend /build/
WORKDIR /build/
# build all dependencies for cache
RUN npm install
RUN npm run build

# mvn builder
FROM maven:3.8.5-openjdk-17-slim AS MAVEN_BUILD
COPY pom.xml /build/
WORKDIR /build/
# build all dependencies for cache
RUN mvn dependency:go-offline -B

COPY --from=NODE_BUILD /build/build/ /build/src/main/resources/META-INF/resources
COPY src /build/src/
RUN mvn install -Dmaven.test.skip=true


# runner container
FROM openjdk:17-slim

RUN apt-get update -y &&\
    apt-get install curl -y &&\
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN curl https://repo1.maven.org/maven2/io/opentelemetry/javaagent/opentelemetry-javaagent/2.6.0/opentelemetry-javaagent-2.6.0.jar -o /app/opentelemetry-javaagent.jar

COPY --from=MAVEN_BUILD /build/target/demo-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
ENV JAVA_OPTIONS=""
ENTRYPOINT ["sh", "-c", "java -javaagent:/app/opentelemetry-javaagent.jar ${JAVA_OPTIONS} -jar app.jar"]