package de.starwit.rest.exception;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.HibernateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.lang.NonNull;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.ClassUtils;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.databind.exc.InvalidDefinitionException;

import de.starwit.persistence.exception.NotificationException;
import jakarta.persistence.EntityNotFoundException;

@ControllerAdvice(basePackages = "de.starwit.rest")
public class ControllerExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(ControllerExceptionHandler.class);

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(@NonNull HttpMessageNotReadableException ex,
            @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<Object> handleException(Exception ex) {
        LOG.error(ex.getClass() + " " + ex.getMessage(), ex.fillInStackTrace());
        NotificationDto output = new NotificationDto("error.internalServerError", "Internal Server Error");
        return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { InvalidDefinitionException.class })
    public ResponseEntity<Object> handleInvalidDefinitionException(Exception ex) {
        LOG.error(ex.getClass() + " " + ex.getMessage(), ex.fillInStackTrace());
        String outputString = "Invalid Definition: " + ex.getMessage() + ".";
        NotificationDto output = new NotificationDto("error.invalidDefinition", outputString);
        return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { Unauthorized.class })
    public ResponseEntity<Object> handleUnauthorizedException(Unauthorized ex) {
        LOG.info("Unauthorized Exception: {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.unauthorized", "Unauthorized requests");
        return new ResponseEntity<>(output, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = { MethodArgumentTypeMismatchException.class })
    public ResponseEntity<Object> handleException(MethodArgumentTypeMismatchException ex) {
        LOG.info("Wrong input value {}", ex.getMessage());
        Object exValue = ex.getValue();
        Class<?> exType = ex.getRequiredType();
        String className = exValue != null ? ClassUtils.getShortName(exValue.getClass()) : "";
        String reqType = exType != null ? ClassUtils.getShortName(exType) : "";
        String outputString = "Wrong input value " + ex.getValue() + ". Failed to convert value of type "
                + className + " to required type "
                + reqType + ".";
        NotificationDto output = new NotificationDto("error.wrongInputValue", outputString);
        return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { NotificationException.class })
    public ResponseEntity<Object> handleException(NotificationException ex) {
        LOG.info("Wrong input value {}", ex.getMessage());
        NotificationDto output = new NotificationDto(ex.getExceptionKey(), ex.getExceptionMessage());
        return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { InvalidDataAccessApiUsageException.class })
    public ResponseEntity<Object> handleException(InvalidDataAccessApiUsageException ex) {
        LOG.info("{} Check if there is an ID declared while object shoud be created.", ex.getMessage());
        NotificationDto output = new NotificationDto("error.badrequest",
                ex.getMessage() + " Check if there is an unvalid ID declared while object shoud be created.");
        return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Entity not found Exception: {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.notfound", "Entity not found");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = { EmptyResultDataAccessException.class })
    public ResponseEntity<Object> handleException(EmptyResultDataAccessException ex) {
        LOG.info(ex.getMessage());
        NotificationDto output = new NotificationDto("error.notexists", "Does not exists and cannot be deleted.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = { AccessDeniedException.class })
    public ResponseEntity<Object> handleException(AccessDeniedException ex) {
        LOG.info(ex.getMessage());
        NotificationDto output = new NotificationDto("error.accessdenied", "access denied");
        output.setMessageKey("error.accessdenied");
        return new ResponseEntity<>(output, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = { JpaSystemException.class })
    public ResponseEntity<Object> handleException(HibernateException ex) {
        if (ex.getMessage().contains("More than one row with the given identifier was found")) {
            LOG.info(ex.getMessage());
            NotificationDto output = new NotificationDto("error.inUse",
                    "More than one row with the given identifier was found");
            return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
        }
        NotificationDto output = new NotificationDto("error.internalServerError", "Internal Server Error");
        return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { DataIntegrityViolationException.class })
    public ResponseEntity<Object> handleException(SQLIntegrityConstraintViolationException ex) {
        NotificationDto output = new NotificationDto("error.sqlIntegrityConstaint",
                "Given data is not in the right format to be saved.");
        if (ex.getMessage().contains("Duplicate entry")) {
            output.setMessageKey("error.unique");
        }
        return new ResponseEntity<>(output, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull MethodArgumentNotValidException ex,
            @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {

            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
