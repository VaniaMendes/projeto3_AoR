package aor.paj.dao;


import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.ArrayList;

@Stateless
public class TaskDao extends AbstractDao<TaskEntity> {

	private static final long serialVersionUID = 1L;

	public TaskDao() {
		super(TaskEntity.class);
	}
	

	public TaskEntity findTaskById(long id) {
		try {
			return (TaskEntity) em.createNamedQuery("Task.findTaskById").setParameter("id", id)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}

	}
	public ArrayList<TaskEntity> findTaskByCategoryName(String category){
		try {

			return (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTaskByCategoryName").setParameter("categoryName", category).getResultList();
		} catch (Exception e) {
			return null;
		}
	}

	public TaskEntity findTaskByTitle(String title) {
		try {
			return (TaskEntity) em.createNamedQuery("Task.findTaskByTitle").setParameter("title", title)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}

	}

	public ArrayList<TaskEntity> findTasksByCategory(CategoryEntity categoryEntity) {
		try {
			ArrayList<TaskEntity> taskEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTasksByCategory").setParameter("category", categoryEntity).getResultList();
			return taskEntities;
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findTasksByUser(UserEntity userEntity) {
		try {
			ArrayList<TaskEntity> activityEntityEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTaskByUser").setParameter("owner", userEntity).getResultList();
			return activityEntityEntities;
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findSoftDeletedTasks() {
		try {
			ArrayList<TaskEntity> softDeletedTasks= (ArrayList<TaskEntity>) em.createNamedQuery("Task.findSoftDeletedTasks").getResultList();
			return softDeletedTasks;
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findAllTasks() {
		try {
			ArrayList<TaskEntity> taskEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findAllTasks").getResultList();
			return taskEntities;
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findActiveTasks() {
		try {
			ArrayList<TaskEntity> taskEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findActiveTasks").getResultList();
			return taskEntities;
		} catch (Exception e) {
			return null;
		}
	}
}
