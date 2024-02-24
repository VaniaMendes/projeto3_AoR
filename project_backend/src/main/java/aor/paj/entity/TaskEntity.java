package aor.paj.entity;

import aor.paj.dto.Category;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name="task")
@NamedQuery(name="Task.findTaskById", query="SELECT a FROM TaskEntity a WHERE a.id = :id")
@NamedQuery(name="Task.findTaskByUser", query="SELECT a FROM TaskEntity a WHERE a.owner = :owner")
public class TaskEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	@Column (name="id", nullable = false, unique = true, updatable = false)
	private long id;

	@Column (name="title", nullable = false, unique = false, updatable = true)
	private String title;

	@Column (name="description", nullable = true, unique = false, length = 65535, columnDefinition = "TEXT")
	private String description;

	@Column(name="initialDate", nullable = false, unique = false, updatable = true)
	private LocalDate initialDate;

	@Column(name="endDate", nullable = false, unique = false, updatable = true)
	private LocalDate endDate;

	@Column(name="priority", nullable = false, unique = false, updatable = true)
	private int priority;

	@Column(name="state", nullable = false, unique = false, updatable = true)
	private String state;

	//Owning Side User - Activity
	@ManyToOne
	@JoinColumn(name="author", nullable = false, unique = false, updatable = false)
	private UserEntity owner;

	
	public TaskEntity() {
		
	}

	public long getId()
	{
		return id;
	}

	public void setId(long id)
	{
		this.id = id;
	}

	public LocalDate getInitialDate() {
		return initialDate;
	}

	public void setInitialDate(LocalDate initialDate) {
		this.initialDate = initialDate;
	}

	public UserEntity getOwner() {
		return owner;
	}

	public void setOwner(UserEntity owner) {
		this.owner = owner;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
}
	
    