FROM eclipse-temurin:21-jre-jammy
# copy application JAR (with libraries inside)

COPY application/target/application-*.jar /opt/application.jar

# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Change ownership of the files to the non-root user
RUN chown -R appuser:appgroup /code

# Switch to non-root user
USER appuser

# specify default command
CMD ["/opt/java/openjdk/bin/java", "-jar", "/opt/application.jar"]
