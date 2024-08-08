FROM maven:3.8.5-openjdk-17-slim AS MAVEN_BUILD

COPY pom.xml /build/
WORKDIR /build/
# build all dependencies for cache
RUN mvn dependency:go-offline -B

COPY src /build/src/
RUN mvn install -Dmaven.test.skip=true


# runner container
FROM openjdk:17-slim

RUN apt-get update -y &&\
    apt-get install curl -y &&\
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=MAVEN_BUILD /build/target/demo-0.0.1-SNAPSHOT.jar /app/app.jar

RUN curl https://repo1.maven.org/maven2/io/opentelemetry/javaagent/opentelemetry-javaagent/2.6.0/opentelemetry-javaagent-2.6.0.jar -o /app/opentelemetry-javaagent.jar

EXPOSE 8080
ENV JAVA_OPTIONS=""
ENTRYPOINT ["sh", "-c", "java -javaagent:/app/opentelemetry-javaagent.jar ${JAVA_OPTIONS} -jar app.jar"]