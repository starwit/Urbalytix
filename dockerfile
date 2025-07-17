FROM eclipse-temurin:21-jre-jammy
# copy application JAR (with libraries inside)

COPY application/target/application-*.jar /opt/application.jar

# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Switch to non-root user
USER appuser

# specify default command
CMD ["/opt/java/openjdk/bin/java", "-jar", "/opt/application.jar"]
