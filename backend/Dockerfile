FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /build
# Copy maven wrapper scripts
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Ensure mvnw has execute permissions
RUN chmod +x mvnw
# Copy over the source code
COPY src ./src
# Build the application using maven wrapper
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre-alpine

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
